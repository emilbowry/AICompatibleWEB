// server/src/controllers/auth/google_callback_handler.ts

import { PrismaClient } from "#prisma/client";
import type { Request, Response } from "express";
import { config } from "../../config/config.js";
import type { IPrismaUserData, TUserProfile } from "./google_auth.types.js";

const prisma = new PrismaClient();

const googleCallback = async (req: Request, res: Response) => {
	const code = req.query.code as string;
	if (!code) {
		return res.redirect(`${config.clientURL}?error=auth_failed_no_code`);
	}

	try {
		// Step 1 & 2: Get Google User
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

		// Step 3: Database "Find or Create" Logic with Prisma
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

		// Step 4: Save the user profile from the database to the session
		(req.session as IPrismaUserData).user = internalUser;
		res.redirect(`${config.clientURL}?login_success=true`);
	} catch (error) {
		console.error("Error during Google OAuth callback:", error);
		res.redirect(`${config.clientURL}?error=auth_failed`);
	}
};

export { googleCallback };
