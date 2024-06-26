import React, { useRef, useState, useEffect } from "react";
import { Container, Typography,InputBase, IconButton, AppBar, Box, Toolbar } from "@mui/material";
import CategoryCard, {
  CategoryCardProps,
} from "@/components/musicCards/CategoryCard";
import Image from "next/image";
import TrackCard, { TrackCardProps } from "@/components/musicCards/TrackCard";
import ArtistCard, {
  ArtistCardProps,
} from "@/components/musicCards/ArtistCard";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import SearchBar from "@/components/search";
import NoResults from "@/components/NoResults";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';
import { Swiper, SwiperSlide } from "swiper/react";

const HomePage: React.FC = () => {

  const categoriesRef = useRef<HTMLDivElement>(null);
  const artistsRef = useRef<HTMLDivElement>(null);
  const [isDraggingCategories, setIsDraggingCategories] = useState(false);
  const [isDraggingArtists, setIsDraggingArtists] = useState(false);
  const [dragStartXCategories, setDragStartXCategories] = useState(0);
  const [dragStartXArtists, setDragStartXArtists] = useState(0);
  const [scrollLeftCategories, setScrollLeftCategories] = useState(0);
  const [scrollLeftArtists, setScrollLeftArtists] = useState(0);

  const router = useRouter();
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (isDraggingCategories) {
        const delta = event.clientX - dragStartXCategories;
        if (categoriesRef.current) {
          categoriesRef.current.scrollLeft = scrollLeftCategories - delta;
        }
      }
      if (isDraggingArtists) {
        const delta = event.clientX - dragStartXArtists;
        if (artistsRef.current) {
          artistsRef.current.scrollLeft = scrollLeftArtists - delta;
        }
      }
    };

    const handleMouseUp = () => {
      setIsDraggingCategories(false);
      setIsDraggingArtists(false);
    };

    if (isDraggingCategories || isDraggingArtists) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    isDraggingCategories,
    isDraggingArtists,
    dragStartXCategories,
    dragStartXArtists,
    scrollLeftCategories,
    scrollLeftArtists,
  ]);

  const handleCategoriesMouseDown = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    setIsDraggingCategories(true);
    setDragStartXCategories(event.clientX);
    setScrollLeftCategories(
      categoriesRef.current ? categoriesRef.current.scrollLeft : 0
    );
  };

  const handleArtistsMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsDraggingArtists(true);
    setDragStartXArtists(event.clientX);
    setScrollLeftArtists(
      artistsRef.current ? artistsRef.current.scrollLeft : 0
    );
  };

  const [categories, setCategories] = useState<CategoryCardProps[]>([]);
  const [tracks, setTracks] = useState<TrackCardProps[]>([]);
  const [artists, setArtists] = useState<ArtistCardProps[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/home/categories");

        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchTracks = async () => {
      try {
        const response = await axios.get("/api/tracks");

        setTracks(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchArtists = async () => {
      try {
        const response = await axios.get("/api/artists");

        setArtists(response.data);
      } catch (error) {
        console.error("Error fetching artists:", error);
      }
    };

    fetchCategories();
    fetchTracks();
    fetchArtists();
  }, []);


  const [searchValue, setSearchValue] = useState('');
    const handleSearchInputChange = (e:any) => {
        setSearchValue(e.target.value);
    };
    const filteredTracks = tracks.filter(track =>
        track.name.toLowerCase().includes(searchValue.toLowerCase())
    );

  return (
    <>
    <Container maxWidth="lg" style={{ paddingTop: "24px" }}>
      <Typography
        variant="h3"
        align="center"
        style={{ marginBottom: "16px", color: "lightblue" }}
      >
        Welcome to SpaceTune
      </Typography>
      <Typography
        variant="body1"
        align="center"
        style={{ marginBottom: "24px", color: "white" }}
      >
        Explore the universe of music with SpaceTune. Listen to your favorite
        tracks from various genres and artists.
      </Typography>

      {/* Categories section */}
      <div style={{
          gap: "16px",
          marginBottom: "24px",
          overflowX: "hidden",
        }}>
        <Swiper
          
          effect={'coverflow'}
          // grabCursor={true}
          centeredSlides={false}
          loop={true}
          slidesPerView={1} // Default to 1 for small screens
          breakpoints={{
            // When the width is >= 576px, display 2 slides per view
            0: {
              slidesPerView: 1.15,
            },
            // When the width is >= 992px, display 3 slides per view
            992: {
              slidesPerView: 3.2,
            },
          }}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            modifier: 2.5,
          }}
          pagination={{ clickable: true }}
          navigation={false}
        >
          {categories.map((category) => (
            <SwiperSlide key={category.id}>
              <Link href={`/home/categories/${category.id}`}>
                <CategoryCard name={category.name} image={category.image} id={category.id} />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

      </div>

      {/* Artists section */}
      <div
        style={{
          gap: "16px",
          marginBottom: "24px",
          overflowX: "hidden",
        }}
      >
        <Swiper
          
          effect={'coverflow'}
          // grabCursor={true}
          centeredSlides={false}
          loop={true}
          slidesPerView={1} // Default to 1 for small screens
          breakpoints={{
            // When the width is >= 576px, display 2 slides per view
            0: {
              slidesPerView: 2,
            },
            // When the width is >= 992px, display 3 slides per view
            992: {
              slidesPerView: 5,
            },
          }}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            modifier: 2.5,
          }}
          pagination={{ clickable: true }}
          navigation={false}
        >
          {artists.map((artist) => (
            <SwiperSlide key={artist.id}>
              <Link href={`/home/artists/${artist.id}`}>
              <ArtistCard
              id={artist.id}
              artist_name={artist.artist_name}
              nationality={artist.nationality}
              language={artist.language}
              image_url={artist.image_url}
              age={artist.age}
              no_of_albums={artist.no_of_albums}
              no_of_songs={artist.no_of_songs}
            />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
        
      </div>
        
      {/* Search section */}
      <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" style={{background: 'none'}}>
                    <Toolbar style={{justifyContent: "end", marginRight: "1ch"}}>
                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Search…"
                                inputProps={{ 'aria-label': 'search' }}
                                value={searchValue}
                                onChange={handleSearchInputChange}
                            />
                        </Search>
                    </Toolbar>
                </AppBar>
            </Box>

      {/* Songs section */}
      <div
  style={{
    display: "flex",
    flexWrap: "wrap",
    gap: "16px",
    marginBottom: "24px",
    marginTop: "25px",
    justifyContent: "center",
    minHeight: "70vh"
  }}
>
  {filteredTracks.length > 0 ? (
    filteredTracks.map((track) => (
      <div
        key={track.id}
        style={{ flex: "0 0 calc(33.33% - 16px)", maxWidth: "calc(33.33% + 146px)", margin: "0 8px" }}
      >
        <TrackCard
          id={track.id}
          name={track.name}
          artist_name={track.artist_name}
          artist_image={track.artist_image}
          track_image={track.track_image}
          duration={track.duration}
          handleClick={() => {}}
        />
      </div>
    ))
  ) : (
    <NoResults />
  )}
</div>

        </Container>
        </>
  );
};

export default HomePage;

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      [theme.breakpoints.up('sm')]: {
          width: '30ch',
          '&:focus': {
              width: '40ch',
          },
      },
  },
}));