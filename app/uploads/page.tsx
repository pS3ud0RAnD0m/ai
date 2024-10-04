import Link from "next/link";

const mockUrls = [
    "https://utfs.io/f/MNln5HUsXuglOc5yvoLwLw9Gmxbu1NvXhVUCJP4iMtZdlaRr",
    "https://utfs.io/f/MNln5HUsXuglOc5yvoLwLw9Gmxbu1NvXhVUCJP4iMtZdlaRr"
]

const mockImages = mockUrls.map((url, index) => ({
    id: index +1,
    url
}));

export default function UploadsPage() {
    return (
      <main className="flex flex-wrap">{
          mockImages.map((image) => (
              <div key={image.id} className="w-48">
                  <img src={image.url} alt="image" />
              </div>
          ))
      }
        Hello (gallery in progress)
      </main>
    );
}
