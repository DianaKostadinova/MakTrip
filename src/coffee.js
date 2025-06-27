import React from 'react';
import './NightLife.css';
import background from './background.jpg';

const cafes = [
    {
        name: 'GreenHill',
        description: 'Rustic yet modern bar with live music and outdoor seating.',
        location: 'Bitola Old Town',
        mapLink: 'https://www.bing.com/maps?&ty=18&q=greenhill&ss=ypid.YN8117x7097700389519399135&mb=41.988516~21.37373~41.978228~21.385574&description=26%2C%20Gorno%20Nerezi%2C%20Skopje%2C%20Skopski%201000&cardbg=%23F98745&dt=1749308400000&tt=Green%20Hill&tsts0=%2526ty%253D18%2526q%253Dgreenhill%2526ss%253Dypid.YN8117x7097700389519399135%2526mb%253D41.988516~21.37373~41.978228~21.385574%2526description%253D26%25252C%252520Gorno%252520Nerezi%25252C%252520Skopje%25252C%252520Skopski%2525201000%2526cardbg%253D%252523F98745%2526dt%253D1749308400000&tstt0=Green%20Hill&cp=41.983372~21.369181&lvl=16&pi=0&ftst=0&ftics=False&v=2&sV=2&form=S00027',
        instagram: 'https://instagram.com/bkwbitola',
        image: 'grinhil.png'
    },
    {
        name: 'Kotur',
        description: 'Stylish bar with a chic interior and great music.',
        location: 'Debar Maalo, Skopje',
        mapLink: 'https://www.google.com/maps?q=Kotur+Skopje',
        instagram: 'https://instagram.com/koturskopje',
        image: 'kotur.png'
    },
    {
        name: 'Kino Karposh',
        description: 'Bar in a retro cinema with events, drinks, and DJs.',
        location: 'Karposh, Skopje',
        mapLink: 'https://www.google.com/maps?q=Kino+Karposh+Skopje',
        instagram: 'https://instagram.com/kinokarposh',
        image: 'kino-karposh.jpg'
    },
    {
        name: 'Crash Bar',
        description: 'Underground rock bar with a raw vibe.',
        location: 'Centar, Skopje',
        mapLink: 'https://www.google.com/maps?q=Crash+Bar+Skopje',
        instagram: 'https://instagram.com/crashbarskopje',
        image: 'crashh.png'
    },
    {
        name: 'Pogon',
        description: 'Hipster-style hangout with occasional gigs and DJ nights.',
        location: 'Centar, Skopje',
        mapLink: 'https://www.google.com/maps?q=Pogon+Skopje',
        instagram: 'https://instagram.com/pogonskopje',
        image: 'pogon.jpg'
    },
    {
        name: 'Samo',
        description: 'Minimalistic café-bar popular among creatives.',
        location: 'Debar Maalo, Skopje',
        mapLink: 'https://www.google.com/maps?q=Samo+Skopje',
        instagram: 'https://instagram.com/samoskopje',
        image: 'samo.jpg'
    },
    {
        name: 'Badu',
        description: 'Outdoor chill zone with a great vibe and live acts.',
        location: 'Skopje City Park',
        mapLink: 'https://www.google.com/maps?q=Badu+Skopje',
        instagram: 'https://instagram.com/baduskopje',
        image: 'badu.png'
    },
    {
        name: 'Radio Bar',
        description: 'Known for jazz nights and creative cocktails.',
        location: 'Debar Maalo, Skopje',
        mapLink: 'https://www.google.com/maps?q=Radio+Bar+Skopje',
        instagram: 'https://instagram.com/radiobarskopje',
        image: 'radioo.png'
    },
    {
        name: 'BKW Bar',
        description: 'Rustic yet modern bar with live music and outdoor seating.',
        location: 'Bitola Old Town',
        mapLink: 'https://www.google.com/maps?q=BKW+Bar+Bitola',
        instagram: 'https://instagram.com/bkwbitola',
        image: 'bkw.jpg'
    },
    {
        name: 'GreenHill',
        description: 'Rustic yet modern bar with live music and outdoor seating.',
        location: 'Bitola Old Town',
        mapLink: 'https://www.bing.com/maps?&ty=18&q=greenhill&ss=ypid.YN8117x7097700389519399135&mb=41.988516~21.37373~41.978228~21.385574&description=26%2C%20Gorno%20Nerezi%2C%20Skopje%2C%20Skopski%201000&cardbg=%23F98745&dt=1749308400000&tt=Green%20Hill&tsts0=%2526ty%253D18%2526q%253Dgreenhill%2526ss%253Dypid.YN8117x7097700389519399135%2526mb%253D41.988516~21.37373~41.978228~21.385574%2526description%253D26%25252C%252520Gorno%252520Nerezi%25252C%252520Skopje%25252C%252520Skopski%2525201000%2526cardbg%253D%252523F98745%2526dt%253D1749308400000&tstt0=Green%20Hill&cp=41.983372~21.369181&lvl=16&pi=0&ftst=0&ftics=False&v=2&sV=2&form=S00027',
        instagram: 'https://instagram.com/bkwbitola',
        image: 'grinhil.png'
    }
];

function NightLife() {
    return (
        <div className="food-page">
            <div className="dropdown-container dropdown">
                <button
                    className="btn btn-secondary dropdown-toggle"
                    type="button"
                    id="dropdownMenuButton"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                    Explore Categories
                </button>
                <ul
                    className="dropdown-menu animate__animated animate__fadeIn"
                    aria-labelledby="dropdownMenuButton"
                >
                    <li><a className="dropdown-item" href="/NightLife">All</a></li>
                    <li><a className="dropdown-item" href="/coffee">Coffee Shops</a></li>
                    <li><a className="dropdown-item" href="/clubs">Discos</a></li>
                </ul>

            </div>

            <div
                className="background-blur"
                style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${background})` }}
            ></div>

            <div className="food-wrapper">
                <div className="food-hero">
                    <h1 className="food-title">Nightlife in Macedonia</h1>
                    <p className="food-sub">
                        Discover vibrant bars and clubs where locals and tourists mingle. Tap a place to explore.
                    </p>
                </div>
                <div className="food-list">
                    {cafes.map((cafe, index) => (
                        <div className="food-card" key={index}>
                            <img src={`/${cafe.image}`} alt={cafe.name} className="food-img" />
                            <div className="food-info">
                                <h3>{cafe.name}</h3>
                                <p>{cafe.description}</p>
                                <p><strong>Location:</strong> {cafe.location}</p>
                                <p>
                                    <a href={cafe.mapLink} target="_blank" rel="noopener noreferrer">
                                        📍 View on Map
                                    </a>
                                </p>
                                <p>
                                    <a href={cafe.instagram} target="_blank" rel="noopener noreferrer">
                                        📸 Instagram
                                    </a>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default NightLife;
