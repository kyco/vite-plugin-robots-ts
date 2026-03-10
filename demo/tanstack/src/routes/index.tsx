import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <>
      <h1>
        <code>vite-plugin-robots-ts basic</code>
      </h1>
      <p style={{ marginLeft: '20px' }}>
        View: <a href="/robots.txt">/robots.txt</a>
      </p>
    </>
  )
}
