import Job from '../../../models/job'
import User from '../../../models/user'
import authenticate from '../../../middleware/authenticate'

const getJobs = async (req, res) => {
    if(req.method == 'GET'){

        const curPage = parseInt(req.query.page) || 1
        const perPage = parseInt(req.query.limit) || 5
        let jobs, totalJobs;
        try{
            const id = req.user.id
            if(req.query.user == "true"){
                jobs = await Job.find({user: id})
                .populate('user')
                .skip((curPage - 1) * perPage)
                .limit(perPage)
                .sort('-createdAt')
                totalJobs = await Job.find({user: id}).countDocuments()
            }else{
                jobs = await Job.find({status: 'open', title: { $regex: new RegExp(req.query.busca), $options: 'i' }})
                .populate('user')
                .skip((curPage - 1) * perPage)
                .limit(perPage)
                .sort('-createdAt')
                totalJobs = await Job.find({status: 'open', title: { $regex: new RegExp(req.query.busca), $options: 'i' }}).countDocuments()
            }

            return res.status(200).json({
                curPage: curPage,
                maxPage: Math.ceil(totalJobs / perPage),
                jobs: jobs
            })
        }catch (error) {
            return res.status(400).send(error)
        }
    }else{
        res.status(405).send('Request method not supported')
    }
}

export default authenticate(getJobs, 'GET')