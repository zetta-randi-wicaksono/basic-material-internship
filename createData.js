db.profile.insertOne({
    name: "Citra Dewi",
    age: 30,
    sex: "female",
    phone: "+6281122334455",
    email: "citra.dewi@example.com",
    address: {
        rt: "3",
        rw: "12",
        padukuhan: "Kricak",
        kelurahan: "Tegalrejo",
        kecamatan: "Tegalrejo",
        kabupatan: "Yogyakarta",
        provinsi: "Yogyakarta",
        zip: "55244",
    },
    hobbies: ["baking", "dancing", "swimming", "reading"]
})

db.profile.insertMany([
    {
        name: "Citra Dewa",
        age: 30,
        sex: "female",
        phone: "+6281122334455",
        email: "citra.dewi@example.com",
        address: {
            rt: "3",
            rw: "12",
            padukuhan: "Kricak",
            kelurahan: "Tegalrejo",
            kecamatan: "Tegalrejo",
            kabupatan: "Yogyakarta",
            provinsi: "Yogyakarta",
            zip: "55244",
        },
        hobbies: ["baking", "dancing", "swimming", "reading"]
    },
    {
        name: "Citra Desi",
        age: 30,
        sex: "female",
        phone: "+6281122334455",
        email: "citra.dewi@example.com",
        address: {
            rt: "3",
            rw: "12",
            padukuhan: "Kricak",
            kelurahan: "Tegalrejo",
            kecamatan: "Tegalrejo",
            kabupatan: "Yogyakarta",
            provinsi: "Yogyakarta",
            zip: "55244",
        },
        hobbies: ["baking", "dancing", "swimming", "reading"]
    }
])