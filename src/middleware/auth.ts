const auth = (req: any, res: any, next: any) => {
    console.log('auth');
    
    if (!req.session.isAuthentificated) {
        // return res.redirect("/auth/login");
        res.send({ status: "не авторизован" });
    }
    next();
};

export default auth