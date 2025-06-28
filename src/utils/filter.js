export const filterOptionUtil= (input, option) => {
    return (
        (option && option.label ? option.label : '')
            .toLowerCase()
            .includes(input.toLowerCase())
    );
};