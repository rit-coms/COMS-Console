
import type { Preview } from "@storybook/react"

const preview: Preview = {
    parameters: {
        controls: {
            disableSaveFromUI: true,
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
            sort: "requiredFirst"
        },
        options: {
            storySort: {
                method: "alphabetical"
            }
        }
    }
}

export default preview
