const variables = (req: any, res: any, next: any) => {
    console.log('variables');
    res.locals.isAuth = req.session.isAuthentificated;
    res.locals.csurf = req.csrfToken();
    console.log('var', req.session);
    console.log('var', res.locals.csurf);
    
    next();
};

export default variables