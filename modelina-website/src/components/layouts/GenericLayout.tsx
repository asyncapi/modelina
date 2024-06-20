import Container from './Container';
import Head from './Head';
import NavBar from './NavBar';
import StickyNavbar from './StickyNavbar';

export default function GenericLayout({
  title,
  description,
  image = '/img/social/modelina-card.jpg',
  children,
  wide = true,
  full = false,
  padding,
  footerPadding = 'mb-12'
}: any) {
  if (!title || !description) {
    throw new Error('Props `title`, and `description` are required at GenericLayout component.');
  }

  return (
    <div className={footerPadding}>
      <Head title={title} description={description} image={image} />
      <StickyNavbar>
        <NavBar className='mx-auto block max-w-screen-xl px-4 sm:px-6 lg:px-8' />
      </StickyNavbar>
      <Container wide={wide} full={full} padding={padding}>
        {children}
      </Container>
    </div>
  );
}
