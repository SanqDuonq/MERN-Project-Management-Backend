import task from 'otp-generator';

const generateTask = () => {
    return `task-${task.generate(3, {
        lowerCaseAlphabets: true,
        upperCaseAlphabets: true,
        specialChars: false,
        digits: true
    })}`
}

export default generateTask;