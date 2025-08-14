/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  theme: {
    extend: {
      fontFamily: {
        'opendyslexic': ['OpenDyslexic', 'sans-serif'],
      },
      colors: {
        dyslexia: {
          cream: '#FDFDF5',
          lightBlue: '#E6F3FF',
          lightYellow: '#FFFDE6',
          lightGray: '#F5F5F5',
          darkGray: '#333333',
          navy: '#000080',
          darkBrown: '#3B2F2F',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
