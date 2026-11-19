import { randomBytes } from "crypto"

const SESSION_DURATION = 8 * 60 * 60 * 1000
const sessions = new Map()

function getSessionToken(req) {
    const cookie = req.headers.cookie || ""
    const sessionCookie = cookie.split(";").map((part) => part.trim())
        .find((part) => part.startsWith("admin_session="))

    return sessionCookie ? sessionCookie.slice("admin_session=".length) : null
}

function getAdminSession(req) {
    const token = getSessionToken(req)
    const expiresAt = token ? sessions.get(token) : null

    if (!expiresAt) {
        return false
    }

    if (expiresAt <= Date.now()) {
        sessions.delete(token)
        return false
    }

    return true
}

function createAdminSession() {
    const now = Date.now()
    for (const [token, expiresAt] of sessions) {
        if (expiresAt <= now) {
            sessions.delete(token)
        }
    }

    const token = randomBytes(32).toString("hex")
    sessions.set(token, now + SESSION_DURATION)
    return token
}

function revokeAdminSession(req) {
    const token = getSessionToken(req)
    if (token) {
        sessions.delete(token)
    }
}

function clearAdminSessionCookie(res) {
    const secure = process.env.NODE_ENV === "production" ? "; Secure" : ""
    res.setHeader("Set-Cookie", `admin_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0${secure}`)
}

function requireAdmin(req, res, next) {
    if (!getAdminSession(req)) {
        return res.status(401).json({ mensagem: "Faça login como administrador para continuar." })
    }

    return next()
}

export {
    clearAdminSessionCookie,
    createAdminSession,
    getAdminSession,
    requireAdmin,
    revokeAdminSession,
}
