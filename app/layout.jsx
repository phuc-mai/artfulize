import "@styles/globals.css";

import Provider from "@components/Provider";

export const metadata = {
  title: "Artfulize",
  description: "Discover & Share Art",
};

const RootLayout = ({ children }) => (
  <html lang='en'>
    <body>
      <Provider>
        <main>
          {children}
        </main>

      </Provider>
    </body>
  </html>
);

export default RootLayout;