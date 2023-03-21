import type { Actions, PageServerLoad } from "./$types"
import { prisma } from "$lib/server/prisma"
import { error, fail } from "@sveltejs/kit"

export const load: PageServerLoad = async ({ params }) => { // En los params se encuentra el article.id

	const getArticle = async () => {
		const article = await prisma.article.findUnique({ // Buscamos dentro de bd un article 
			where: {                                      // donde
				id: Number(params.articleId),             // id = params.articleId
			},
		})
		if (!article) {
			throw error(404, "Article not found")
		}
		return article
	}

	return {
		article: getArticle(),
	}
}

export const actions: Actions = {

	updateArticle: async ({ request, params }) => { // los params vienen de la ruta dinámica [articleId]
		
		const { title, content } = Object.fromEntries(await request.formData()) as { // Valores actualizados del formulario
			title: string
			content: string
		}

		try {
			await prisma.article.update({           // Actualizamos article con prisma
				where: {                            // donde
					id: Number(params.articleId),   // id = params.articleId

				},
				data: {                             // y se hace con los datos actualizados.
					title,
					content,
				},
			})
		} catch (err) {
			console.error(err)
			return fail(500, { message: "Could not update article" })
		}

		return {
			status: 200,
		}
	},
}
