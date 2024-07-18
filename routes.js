import authRouter from "./Src/modules/auth/auth.router.js"
import categoryRouter from "./Src/modules/category/category.router.js"
import taskRouter from "./Src/modules/task/task.router.js"
import userRouter from "./Src/modules/user/user.router.js"


const allRouters = (app)=>{
    app.use('/api/v1/auth',authRouter),
    app.use('/api/v1/task',taskRouter),
    app.use('/api/v1/category',categoryRouter),
    app.use('/api/v1/user',userRouter)


}

export default allRouters