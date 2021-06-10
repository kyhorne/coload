import Head from "next/head";
import { useUser } from "@auth0/nextjs-auth0";

export default function Home() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

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
            <section className="navbar container">
              <div className="flex">
                <nav>
                  <ul>
                    <li>
                      <a href="#features">Features</a>
                    </li>
                    <li>
                      <a href="#tutorial">How Coload Works</a>
                    </li>
                    <li>
                      {user ? (
                        <a href="/api/auth/logout">Logout</a>
                      ) : (
                        <a href="/api/auth/login">Login</a>
                      )}
                    </li>
                    <li>
                      <a href="mailto:help@thecoload.com">Contact</a>
                    </li>
                    <li>
                      <a href="">Subscribe Now</a>
                    </li>
                  </ul>
                </nav>
              </div>
            </section>
            <section className="hero container">
              <div className="flex">
                <div className="content">
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
          <section id="features" className="features">
            <div className="container">
              <h3 className="text-center ">
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
          <section className="tutorial" id="tutorial">
            <div className="container tut-grid">
              <h3>How Coload Works</h3>
              <ol>
                <li>
                  Browse
                  <p>
                    Start by exploring our storage options and select a plan
                    based on your needs.
                  </p>
                </li>
                <li>
                  Ship
                  <p>
                    Once you’ve found what you’re looking for, ship the product
                    to our storage facility. You will receive confirmation once
                    it has been tracked and stored.
                  </p>
                </li>
                <li>
                  Act
                  <p>
                    Select items for return or sell them on our marketplace – we
                    will fulfil the shipment. You can also contact Coload at any
                    time for additional support.
                  </p>
                </li>
              </ol>
              <img
                style={{
                  position: "static",
                  objectFit: "contain",
                  maxHeight: 500,
                }}
                src="mcg.png"
              />
            </div>
          </section>
          <footer></footer>
        </main>
      </body>
    </div>
  );
}
