import { OAuth2Client } from 'google-auth-library';

/**
 *  This function is used verify a google account
*/

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const client = new OAuth2Client(GOOGLE_CLIENT_ID)

const verfiyGoogleToken = async (token) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID
    })
    return { payload: ticket.getPayload() }
  } catch (error) {
    return {error: "Invalid user detected. Please try again"}
  }
}

export {
  verfiyGoogleToken
}
