import Planets from "./api/Planets.json"

const Buttons = () => {
    return (<>
        {Planets.map((planet, index) => {
            return <details className="gap-2 text-center" name="planets" key={index}>
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