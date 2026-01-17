interface GameCardProps {
  name: string
  logo: string
  steamUrl: string
}

export default function GameCard({ name, logo, steamUrl }: GameCardProps) {
  return (
    <a
      href={steamUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="game-card"
    >
      <div className="game-card-inner">
        <img src={logo} alt={name} className="game-logo" />
        <p className="game-name">{name}</p>
      </div>
      <div className="game-hover-indicator">→</div>
    </a>
  )
}
