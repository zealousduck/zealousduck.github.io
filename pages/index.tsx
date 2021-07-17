import Head from "next/head";
import React from "react";
import { getQuest } from "../app/quests";
import styles from "../styles/Home.module.css";

const MAX_QUESTS = 6;

export default function Home() {
  const generateUnique = (seed?: Set<string>): Set<string> => {
    const result = seed ?? new Set<string>();
    while (result.size < MAX_QUESTS) {
      result.add(getQuest());
    }
    return result;
  }

  const [quests, setQuests] = React.useState<Set<string>>(
    generateUnique()
  );

  React.useEffect(() => {
    setQuests(generateUnique());
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Oak Door</title>
        <meta name="description" content="indeednd" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="quest-board">
        {Array.from(quests.entries()).map(([,q], index) => (
          <div key={Math.random()} className="quest-container"
          >
            <div className="quest-text">{q}</div>
            <div className="actions">
              <button className="copy"
              onClick={() => {
                navigator.clipboard.writeText(q).catch(console.error);
              }}
              >
                <img src={"/copy.svg"} alt="copy"/>
              </button>
              <button className="refresh"
                onClick={() => {
                  const updated = Array.from(quests.entries()).map(_ => _[1]);
                  updated[index] = getQuest();
                  setQuests(new Set(updated));
                }}
              >
                <img src={"/replay.svg"} alt="refresh"/>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
