export default function App({ Component, pageProps }) {
  return (
    <>
      <style jsx global>
        {`
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
              "Helvetica Neue", Arial, "Noto Sans", sans-serif,
              "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
              "Noto Color Emoji";
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
        `}
      </style>
      <Component {...pageProps} />
    </>
  );
}
