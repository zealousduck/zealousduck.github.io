import Head from 'next/head';
import Image from 'next/image';
import { getQuest } from '../app/quests';
import styles from '../styles/Home.module.css';

export default function Home() {
  const quests = new Array(6).fill("").map(getQuest);
  return (
    <div className={styles.container}>
      <Head>
        <title>Oak Door</title>
        <meta name="description" content="indeednd" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

        <div className="quest-board" style={{
          // background: `url("${process.env.PUBLIC_URL}wood.jpg") repeat`
        }}>
          {quests.map((q) => (<div key={q} className="quest-container" style={{
            // background: `url("${process.env.PUBLIC_URL}paper.png") no-repeat`
          }}>
            <div className="quest-text">{q}</div>
          </div>))}
        </div>
    </div>
  );
}
