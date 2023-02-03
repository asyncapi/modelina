import Head from './Head';
import NavBar from './NavBar'
import Container from './Container'
import Footer from './Footer';
import StickyNavbar from './StickyNavbar'

export default function GenericLayout({
  title,
  description,
  image,
  children,
  wide = true
}: any) {
  if (!title || !description || !image) throw new Error('Props `title`, `description`, and `image` are required at GenericLayout component.')
  
  return (
    <>
      <Head
        title={title}
        description={description}
        image={image}
      />
     <StickyNavbar>
       <NavBar className="max-w-screen-xl block px-4 sm:px-6 lg:px-8 mx-auto" />
     </StickyNavbar>
      <Container wide={wide}>
        {children}
      </Container>
    </>
  )
}
