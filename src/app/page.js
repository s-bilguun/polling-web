import Image from 'next/image'
import Link from 'next/link'

export default function Page() {
  return (
    <>
      <nav>
        {/* Your navigation code here */}
      </nav>
      <main>
        <h1>Welcome to the Polling Web</h1>
        <p>Get started by:</p>
        <ul>
          <li>
            <Link href="/register">Register</Link>
          </li>
          <li>
            <Link href="/login">Login</Link>
          </li>
        </ul>
      </main>
      <footer>
        {/* Your footer code here */}
      </footer>
    </>
  )
}