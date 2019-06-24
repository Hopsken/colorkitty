const prefix = 'colorkitty'
const withPrefix = (append: string) => prefix + append

const saveLikeById = (id: number) => {
    localStorage.setItem(
        withPrefix('/like/') + String(id),
        String(id)
    )
}

const removeLikeById = (id: number) => {
    localStorage.removeItem(
        withPrefix('/like/') + String(id)
    )
}

const getLikeIds = () => {
    const likes = []

    for (let i = 0, len = localStorage.length; i < len; i++) {
        const key = localStorage.key(i)!
        if (key.startsWith(withPrefix('/like/'))) {
            likes.push(Number(localStorage.getItem(key)))
        }
    }

    return likes
}

export {
    saveLikeById,
    removeLikeById,
    getLikeIds,
}
