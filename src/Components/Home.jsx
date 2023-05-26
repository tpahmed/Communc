import Container from "./Global/Container";

export default function Home() {
  return (
    <Container>
        <div className="Home"><img src={sessionStorage.getItem('pfp')} alt="" width={'50px'} /></div>
    </Container>
  )
}
