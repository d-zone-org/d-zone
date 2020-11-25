import Head from "next/head"
import styled from "styled-components"

const Layout = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Title = styled.h1`
  font-size: 4em;
  font-family: sans-serif;
`

export default function Home() {
  return (
    <>
      <Head>
        <title>D-Zone</title>
      </Head>

      <Layout>
        <Title>Hey there!</Title>
      </Layout>
    </>
  )
}
