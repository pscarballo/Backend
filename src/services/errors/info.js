export const generateUserErrorInfo = (user) => {
  return `
      Una o mas propiedades estan incompletas o invalidas!!!
      Lista de propiedades obligatgorias:
          * first_name: Must be a string. (${user.first_name})
          * last_name: Must be a string. (${user.last_name})
          * email: Must be a string. (${user.email})    
      `;
};
