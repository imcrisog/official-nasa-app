import { useState } from "react";
import { Planets } from "./index.js"

const Buttons = () => {
    return (<>
        {Planets.map(planet => {
            return <details className="gap-2 text-center" name="planets"> 
            <summary className="py-2"> {planet.name} </summary>
            <p>{planet.desc}</p>
        </details>
        })}
    </>)
}

export default function Interface() {
    
    return ( 
        <div className="fixed bg-gray-800 text-white bottom-0 right-0 z-10 planetdiv">
            <h2 className="text-lg font-bold text-center flex ">Planets</h2>
            <Buttons></Buttons>
        </div>
    );
}