export const logoutUserHandler = async (req, res) => {
    
  // في الحالة دي الكلاينت بس بيشيل التوكن عنده
    
    res.status(200).json({
      message: "Logout successful. Please remove the token from your client."
    });
};
