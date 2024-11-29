
type MeterType = {
    count:string| number,
    text?:string,
    rotation:string | number
}
const Meter = ({count,text = "Unresolve Tickets",rotation}:MeterType) => {
    return (
        <div className="meter  max-w-40 mx-auto relative">
        <p className="count">{count}</p>
            <p className="info-text">{text}</p>
            <div className="needle" style={{"--rotation": `${rotation}deg`}}></div>
        </div>
    );
}

export default Meter;