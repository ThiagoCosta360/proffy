import express, { response } from "express"
import db from "./database/connection"
import convertHourToMinutes from "./utils/ConvertHourToMinutes"

const routes = express()

routes.get("/", (req, res) => {
    return res.json({ Message: "Hello World" })
})

routes.post("/classes", async (req, res) => {
    const { name, avatar, whatsapp, bio, subject, cost, schedule } = req.body

    const trx = await db.transaction()

    try {
        const insertedUsersIds = await trx("users").insert({
            name,
            avatar,
            whatsapp,
            bio,
        })

        const user_id = insertedUsersIds[0]

        const insertedClassesIds = await trx("classes").insert({
            subject,
            cost,
            user_id,
        })

        const class_id = insertedClassesIds[0]

        interface scheduleDb {
            class_id: Number
            week_day: Number
            from: Number
            to: Number
        }

        interface schedulePost {
            week_day: Number
            from: String
            to: String
        }

        const classSchedule = schedule.map(
            (el: schedulePost): scheduleDb => {
                return {
                    class_id,
                    week_day: el.week_day,
                    from: convertHourToMinutes(el.from),
                    to: convertHourToMinutes(el.to),
                }
            }
        )

        await trx("class_schedule").insert(classSchedule)

        await trx.commit()

        return res.status(201).send()
    } catch (err) {
        await trx.rollback()

        return response.status(400).json({
            error: "Unexpected error while creating new class",
        })
    }
})

export default routes
