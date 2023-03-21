import type { Actions, PageServerLoad } from "./$types"
import { prisma } from "$lib/server/prisma"
import { fail } from "@sveltejs/kit"

export const load: PageServerLoad = async () => {
	return {
		articles: await prisma.article.findMany(),
	}
}

export const actions: Actions = {
	createArticle: async ({ request }) => {                                          // request contiene todo el contenido del form
		const { title, content } = Object.fromEntries(await request.formData()) as { // formData -> objeto javascript
			title: string                                                            // fromEntries -> objeto clave - valor 
			content: string
		}

		try {
			await prisma.article.create({ // prisma crea un nuevo artículo
				data: {
					title,
					content,
				},
			})
		} catch (err) {
			console.error(err)
			return fail(500, { message: "Could not create the article." })
		}

		return {
			status: 201,
		}
	},
	deleteArticle: async ({ url }) => {
		const id = url.searchParams.get("id")
		if (!id) {
			return fail(400, { message: "Invalid request" })
		}

		try {
			await prisma.article.delete({
				where: {
					id: Number(id),
				},
			})
		} catch (err) {
			console.error(err)
			return fail(500, {
				message: "Something went wrong deleting your article",
			})
		}

		return {
			status: 200,
		}
	},
}
