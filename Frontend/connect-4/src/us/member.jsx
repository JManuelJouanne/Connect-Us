import './member.css'

export default function Member({name, description, image}) {
    return (
        <div className="member">
            <img src={image} alt={name} className="pic-profile"/>
            <h3>{name}</h3>
            <p className='description'>{description}</p>
        </div>
    )
}
