import Head from "next/head";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Coload | TCG Storage</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <main>
          <div
            style={{
              background: "url(pokemon.png)",
              backgroundRepeat: "no-repeat",
              // backgroundAttachment: "fixed",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          >
            <section className="navbar">
              <div className="flex">
                <nav className="container">
                  <ul>
                    <li>
                      <a href="#">Features</a>
                    </li>
                    <li>
                      <a href="#">How it Works</a>
                    </li>
                    <li>
                      <a href="#">Login</a>
                    </li>
                    <li>
                      <a href="mailto:help@thecoload.com">Contact</a>
                    </li>
                    <li>
                      <a href="#">Subscribe Now</a>
                    </li>
                  </ul>
                </nav>
              </div>
            </section>
            <section className="hero">
              <div className="flex">
                <div className="container">
                  <h1>Coload Inc.</h1>
                  <p>
                    A marketplace and secure, personalized storage for your
                    collectable card game.
                  </p>
                  <a href="#" className="btn btn-outline">
                    Subscribe Now
                  </a>
                </div>
              </div>
            </section>
          </div>
          <section className="features">
            <div className="container">
              <h3 className="text-center my-1">
                Goodbye, overpriced safety deposit boxes.
              </h3>
              <div className="grid my-4">
                <div className="feature">
                  <h3>Storage</h3>
                  <div className="icons8-trolley feature-icon"></div>
                  <p>
                    We offer subscription-based, personalized storage options
                    for raw, sealed and slabbed trading card products.
                  </p>
                </div>
                <div className="feature">
                  <h3>Secure</h3>
                  <div className="icons8-favorites-shield feature-icon" />
                  <p>
                    Our 24/7 surveilled, light and temperature-controlled
                    facility protects from theft, fires, floods, and natural
                    disasters.
                  </p>
                </div>
                <div className="feature">
                  <h3>Marketplace (Coming Soon)</h3>
                  <div className="icons8-price-tag feature-icon" />
                  <p>
                    Infrastructure to buy or sell without the overhead of
                    finding a merchant, storing, or shipping the product.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </body>
    </div>
  );
}
