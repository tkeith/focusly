import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { baseProcedure } from "~/server/trpc/main";
import { chromium } from "playwright";

interface ScrapedContent {
  title: string;
  content: {
    type: "heading" | "paragraph";
    level?: number; // for headings (h1, h2, etc.)
    text: string;
  }[];
  url: string;
}

export const scrapeArticle = baseProcedure
  .input(z.object({ 
    url: z.string().url("Please enter a valid URL") 
  }))
  .mutation(async ({ input }): Promise<ScrapedContent> => {
    let browser;
    try {
      // Launch browser
      browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      const page = await browser.newPage();
      
      // Navigate to the URL with timeout
      await page.goto(input.url, { 
        waitUntil: 'domcontentloaded',
        timeout: 30000 
      });
      
      // Wait a bit for dynamic content to load
      await page.waitForTimeout(2000);
      
      // Extract content using multiple strategies
      const scrapedData = await page.evaluate(() => {
        // Helper function to clean text
        const cleanText = (text: string): string => {
          return text
            .replace(/\s+/g, ' ')
            .replace(/\n+/g, ' ')
            .trim();
        };

        // Helper function to extract text from element and its children
        const extractText = (element: Element): string => {
          // Remove script and style elements
          const clone = element.cloneNode(true) as Element;
          const scripts = clone.querySelectorAll('script, style, nav, header, footer, aside, .advertisement, .ads, .social-share');
          scripts.forEach(el => el.remove());
          return cleanText(clone.textContent || '');
        };

        // Strategy 1: Look for article tags
        let mainContent = document.querySelector('article');
        
        // Strategy 2: Look for main tags
        if (!mainContent) {
          mainContent = document.querySelector('main');
        }
        
        // Strategy 3: Look for role="main"
        if (!mainContent) {
          mainContent = document.querySelector('[role="main"]');
        }
        
        // Strategy 4: Look for common content containers
        if (!mainContent) {
          const selectors = [
            '.content',
            '.post-content',
            '.article-content',
            '.entry-content',
            '.main-content',
            '#content',
            '#main-content'
          ];
          
          for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element) {
              mainContent = element;
              break;
            }
          }
        }
        
        // Strategy 5: Find the largest text block
        if (!mainContent) {
          const allDivs = Array.from(document.querySelectorAll('div, section'));
          let largestDiv = null;
          let maxTextLength = 0;
          
          for (const div of allDivs) {
            const text = extractText(div);
            if (text.length > maxTextLength) {
              maxTextLength = text.length;
              largestDiv = div;
            }
          }
          mainContent = largestDiv;
        }

        if (!mainContent) {
          throw new Error('Could not find main content');
        }

        // Extract title
        let title = '';
        
        // Try different title extraction methods
        const titleSelectors = [
          'h1',
          'title',
          '[property="og:title"]',
          '.title',
          '.post-title',
          '.article-title'
        ];
        
        for (const selector of titleSelectors) {
          const titleEl = document.querySelector(selector);
          if (titleEl) {
            if (selector === '[property="og:title"]') {
              title = (titleEl as HTMLMetaElement).content;
            } else {
              title = cleanText(titleEl.textContent || '');
            }
            if (title.length > 0) break;
          }
        }
        
        if (!title) {
          title = document.title || 'Untitled Article';
        }

        // Extract structured content
        const content: { type: "heading" | "paragraph"; level?: number; text: string; }[] = [];
        
        // Get all headings and paragraphs within the main content
        const elements = mainContent.querySelectorAll('h1, h2, h3, h4, h5, h6, p, div');
        
        for (const element of elements) {
          const tagName = element.tagName.toLowerCase();
          const text = extractText(element);
          
          if (text.length < 10) continue; // Skip very short content
          
          if (tagName.match(/^h[1-6]$/)) {
            const level = parseInt(tagName.charAt(1));
            content.push({
              type: 'heading',
              level,
              text
            });
          } else if (tagName === 'p' || (tagName === 'div' && text.length > 50)) {
            content.push({
              type: 'paragraph',
              text
            });
          }
        }
        
        // If we didn't get much structured content, fall back to splitting text
        if (content.length < 3) {
          const fullText = extractText(mainContent);
          const sentences = fullText.split(/[.!?]+/).filter(s => s.trim().length > 20);
          
          for (const sentence of sentences) {
            content.push({
              type: 'paragraph',
              text: cleanText(sentence)
            });
          }
        }

        return { title: cleanText(title), content };
      });

      if (!scrapedData.content || scrapedData.content.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Could not extract readable content from this webpage"
        });
      }

      return {
        ...scrapedData,
        url: input.url
      };

    } catch (error) {
      console.error('Scraping error:', error);
      
      if (error instanceof TRPCError) {
        throw error;
      }
      
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to scrape the webpage. Please check the URL and try again."
      });
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  });
