import Head from "next/head";
import React from "react";
import ReactDOM from "react-dom";
import { getQuest } from "../app/quests";
import styles from "../styles/Home.module.css";

const MAX_QUESTS = 6;

export default function Home() {
  const fonts = React.useRef(new Map<string,React.CSSProperties>());

  const [quests, setQuests] = React.useState<Set<string>>(
    generateUnique()
  );

  React.useEffect(() => {
    ReactDOM.unstable_batchedUpdates(() => { 
      const quests = generateUnique();
      setQuests(quests);
      for (const quest of quests.values()) {
        if (!fonts.current.has(quest)) {
          fonts.current.set(quest, randomFontStyle())
        }
      }
    });
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
          <div key={q} className="quest-container"
          >
            <div className="quest-text"
            style={fonts.current.get(q)}
            >{q}</div>
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
                  const quest = getQuest();
                  updated[index] = quest;
                  setQuests(new Set(updated));
                  if (!fonts.current.has(quest)) {
                    fonts.current.set(quest, randomFontStyle())
                  }
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

const generateUnique = (seed?: Set<string>): Set<string> => {
  const result = seed ?? new Set<string>();
  while (result.size < MAX_QUESTS) {
    result.add(getQuest());
  }
  return result;
}

const randomFontStyle = (): { fontFamily: string; fontSize: string; } => {
  const defaultFont = "papyrus, serif"
  const fonts = [{
    fontFamily: defaultFont
    , fontSize: "1.2em"
  }, {
    fontFamily: `ink free, ${defaultFont}`
    , fontSize: "1.2em"
  }, {
    fontFamily: `bradley hand itc, ${defaultFont}`
    , fontSize: "1.2em"
  }, {
    fontFamily: `segoe print, ${defaultFont}`
    , fontSize: "1.2em"
  }, {
    fontFamily: `viner hand itc, ${defaultFont}`
    , fontSize: "1.2em"
  }]

  const index = Math.floor(Math.random() * fonts.length);

  return fonts[index];
}
