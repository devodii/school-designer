import { Node } from "@tiptap/react"

export const TagExtension = Node.create({
  name: "tag",
  group: "inline",
  inline: true,
  selectable: false,
  atom: true,

  addAttributes() {
    return { content: { default: null } }
  },

  parseHTML() {
    return [{ tag: 'span[contenteditable="false"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      { class: "text-black font-semibold text-sm mx-1", contenteditable: "false" },
      HTMLAttributes.content,
    ]
  },
})
