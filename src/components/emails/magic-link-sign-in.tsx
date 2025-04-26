interface MagicLinkSignInProps {
  url: string
}

export const MagicLinkSignIn = ({ url }: MagicLinkSignInProps) => (
  <div>
    <h1>Welcome, {url}!</h1>
  </div>
)
