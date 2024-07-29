db.profile.update({sex: "female"}, 
    {$set:{age: 10}}
)

db.profile.updateOne({_id: ObjectId("66964bd4781c7b33584a82e7")},{$set:{name: "Budi Winaryo Lestari"}})

db.profile.update({_id: ObjectId("66964bd4781c7b33584a82e7")}, 
    {$push: {hobbies: "makan"}}
)

db.profile.update({_id: ObjectId("66964bd4781c7b33584a82e7")}, 
    {$pull: {hobbies: "makan"}}
)

db.profile.update({_id: ObjectId("66964bd4781c7b33584a82e7")}, 
    {$set:{'address.provinsi': 'Jawa Tengah'}}, 
)