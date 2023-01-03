export function toSlug(name) {
    // Replace spaces with hyphens
    let slug = name.replace(/\s+/g, '-');

    // Convert to lowercase
    slug = slug.toLowerCase();

    // Remove non-word characters
    slug = slug.replace(/[^\w-]+/g, '');

    return slug;
}