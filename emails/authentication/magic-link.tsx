import * as React from "react"

import { Body, Button, Heading, Html, Section, Text } from "@react-email/components"

interface MagicLinkEmailProps {
  url: string
}

const MagicLinkEmail = ({ url }: MagicLinkEmailProps) => {
  return (
    <Html>
      <Body style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        <Section>
          <Heading
            as="h2"
            style={{
              width: "100%",
              textAlign: "center",
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", "Ubuntu", sans-serif',
              fontSize: 24,
            }}
          >
            🎒 Sign into your account
          </Heading>
        </Section>

        <Text
          style={{
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", "Ubuntu", sans-serif',
            fontSize: 16,
            width: "100%",
            textAlign: "center",
            marginTop: 0,
          }}
        >
          Please click on the button below to sign in
        </Text>
        <Button
          href={url}
          style={{
            background: "#000",
            color: "#fff",
            padding: "12px 20px",
            marginInline: "auto",
            borderRadius: 10,
            width: "100%",
            maxWidth: 200,
            textAlign: "center",
            marginTop: -10,

          }}
        >
          Signin
        </Button>
      </Body>
    </Html>
  )
}

export default MagicLinkEmail
