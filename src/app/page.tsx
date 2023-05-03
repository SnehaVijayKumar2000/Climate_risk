"use client"
import riskData from './data/data.json';
import dynamic from 'next/dynamic'
import { useState, useEffect } from "react";

export default function Home() {
  const [domLoaded, setDomLoaded] = useState(false);
  useEffect(() => {
    setDomLoaded(true);
  }, []);
  const decades = [...new Set(riskData.map(risk => risk.Year).sort())]

  const [decade, setDecade] = useState(decades[0])

  const Dashboard = dynamic(
    () =>  import("./dashboard"),
    { ssr: false }
  )

  return (
    <>
    {domLoaded && <main>
        <select className="decadeSelector" value={decade} onChange={(e) => {setDecade(e.target.value);}}>
        {
          decades.map(d=> <option key={d}>{d}</option>)
        }
        </select>
        <Dashboard decade={decade} />
    </main>}
    </>
  )
}
