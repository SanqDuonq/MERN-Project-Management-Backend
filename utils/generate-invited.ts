import invited from 'otp-generator';

const generateInvited = () => {
    return invited.generate(8, {
        lowerCaseAlphabets: true,
        upperCaseAlphabets: true,
        specialChars: false,
        digits: true
    })
}

export default generateInvited;