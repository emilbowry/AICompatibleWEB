import type { Request, Response } from "express";
import { config } from "../../config/config.js";
import { IUserSessionData } from "./google_auth.types.js";

const googleLogin = (_req: Request, res: Response) => {
	const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";

	const options = {
		redirect_uri: config.google.redirectUri,
		client_id: config.google.clientId,
		access_type: "offline",
		response_type: "code",
		prompt: "consent",
		scope: [
			"https://www.googleapis.com/auth/userinfo.profile",
			"https://www.googleapis.com/auth/userinfo.email",
		].join(" "),
	};

	const qs = new URLSearchParams(options);
	const url = `${rootUrl}?${qs.toString()}`;

	res.redirect(url);
};

const getCurrentUser = (req: Request, res: Response) => {
	if ((req.session as IUserSessionData).user) {
		res.status(200).json((req.session as IUserSessionData).user);
	} else {
		res.status(401).json({ message: "Not authenticated" });
	}
};
const logout = (req: Request, res: Response) => {
	if (req.session) {
		req.session.destroy((err) => {
			if (err) {
				res.status(500).send({ message: "Failed to log out." });
			} else {
				res.clearCookie("connect.sid");
				res.status(200).send({ message: "Logged out successfully." });
			}
		});
	} else {
		res.status(200).send({ message: "No active session to log out." });
	}
};

import { PrismaClient } from "#prisma/client";
import type { IPrismaUserData, TUserProfile } from "./google_auth.types.js";
/**
 * @improvement - make less monolithic
 */
const prisma = new PrismaClient();

const googleCallback = async (req: Request, res: Response) => {
	const code = req.query.code as string;
	if (!code) {
		return res.redirect(`${config.clientURL}?error=auth_failed_no_code`);
	}

	try {
		const tokenUrl = "https://oauth2.googleapis.com/token";
		const tokenParams = new URLSearchParams({
			code,
			client_id: config.google.clientId,
			client_secret: config.google.clientSecret,
			redirect_uri: config.google.redirectUri,
			grant_type: "authorization_code",
		});
		const tokenRes = await fetch(tokenUrl, {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: tokenParams.toString(),
		});
		const tokens = await tokenRes.json();
		if (!tokenRes.ok)
			throw new Error(
				tokens.error_description || "Failed to fetch tokens"
			);

		const userinfoUrl = "https://www.googleapis.com/oauth2/v2/userinfo";
		const userinfoRes = await fetch(userinfoUrl, {
			headers: { Authorization: `Bearer ${tokens.access_token}` },
		});
		const googleUser = await userinfoRes.json();
		if (!userinfoRes.ok) throw new Error("Failed to fetch user info");

		let internalUser: TUserProfile;

		const linkedAccount = await prisma.linkedAccount.findUnique({
			where: {
				provider_providerUserId: {
					provider: "google",
					providerUserId: googleUser.id,
				},
			},
			include: { user: true },
		});

		if (linkedAccount) {
			internalUser = linkedAccount.user;
		} else {
			const existingUser = await prisma.user.findUnique({
				where: { email: googleUser.email },
			});
			if (existingUser) {
				await prisma.linkedAccount.create({
					data: {
						provider: "google",
						providerUserId: googleUser.id,
						userId: existingUser.id,
					},
				});
				internalUser = existingUser;
			} else {
				const newUser = await prisma.user.create({
					data: {
						email: googleUser.email,
						name: googleUser.name,
						accounts: {
							create: {
								provider: "google",
								providerUserId: googleUser.id,
							},
						},
					},
				});
				internalUser = newUser;
			}
		}

		(req.session as IPrismaUserData).user = internalUser;
		res.redirect(`${config.clientURL}?login_success=true`);
	} catch (error) {
		console.error("Error during Google OAuth callback:", error);
		res.redirect(`${config.clientURL}?error=auth_failed`);
	}
};

export { getCurrentUser, googleCallback, googleLogin, logout };
