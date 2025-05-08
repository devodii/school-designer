import * as React from "react"

import { Body, Button, Heading, Html, Section, Text } from "@react-email/components"

interface MagicLinkEmailProps {
  url: string
}

const baseStyles = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", "Ubuntu", sans-serif',
  color: "#000",
}

const MagicLinkEmail = ({ url }: MagicLinkEmailProps) => {
  return (
    <Html>
      <Body style={{ ...baseStyles, padding: "40px 20px", backgroundColor: "#f9fafb" }}>
        <Section
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            backgroundColor: "#ffffff",
            padding: "40px",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <Heading
            as="h2"
            style={{
              ...baseStyles,
              fontSize: "24px",
              fontWeight: "600",
              textAlign: "center",
              marginBottom: "24px",
            }}
          >
            🎒 Welcome Back!
          </Heading>

          <Text
            style={{
              ...baseStyles,
              fontSize: "16px",
              lineHeight: "24px",
              textAlign: "center",
              marginBottom: "32px",
              color: "#4b5563",
            }}
          >
            Click the button below to sign in to your account securely.
          </Text>

          <Button
            href={url}
            style={{
              ...baseStyles,
              backgroundColor: "#000000",
              color: "#ffffff",
              padding: "16px 24px",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "500",
              textDecoration: "none",
              textAlign: "center",
              display: "block",
              width: "100%",
              maxWidth: "240px",
              margin: "0 auto",
            }}
          >
            Sign In Now
          </Button>

          <Text
            style={{
              ...baseStyles,
              fontSize: "14px",
              color: "#6b7280",
              textAlign: "center",
              marginTop: "32px",
            }}
          >
            If you didn't request this email, you can safely ignore it.
          </Text>
        </Section>
      </Body>
    </Html>
  )
}

export default MagicLinkEmail
