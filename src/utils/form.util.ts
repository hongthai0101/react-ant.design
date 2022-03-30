export const formLayoutItem = (labelCol = 5) => {
    return {
        labelCol: {
            span: labelCol
        },
        wrapperCol: {
            span: 24 - labelCol
        },
    }
}