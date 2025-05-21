import React from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  Card,
  CardContent,
  CardMedia,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent
} from '@mui/lab';
import {
  MenuBook as MenuBookIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  EmojiEvents as EmojiEventsIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const About = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Team members data
  const teamMembers = [
    {
      id: 1,
      name: 'Dr. Eleanor Richards',
      role: 'Library Director',
      bio: 'Dr. Richards has over 20 years of experience in library science and information management. She holds a Ph.D. in Library Science from Harvard University.',
      image: 'https://randomuser.me/api/portraits/women/33.jpg'
    },
    {
      id: 2,
      name: 'Marcus Johnson',
      role: 'Head of Collections',
      bio: 'Marcus oversees our extensive collection development and preservation efforts. He specializes in rare books and digital archiving.',
      image: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      id: 3,
      name: 'Sophia Chen',
      role: 'Community Outreach Manager',
      bio: 'Sophia develops and implements our community programs and partnerships. She passionate about making library resources accessible to all.',
      image: 'https://randomuser.me/api/portraits/women/64.jpg'
    },
    {
      id: 4,
      name: 'James Wilson',
      role: 'Technology Services Manager',
      bio: 'James leads our digital initiatives and ensures our technology services meet the evolving needs of our patrons.',
      image: 'https://randomuser.me/api/portraits/men/52.jpg'
    }
  ];

  // Library history timeline
  const historyTimeline = [
    {
      year: '1892',
      title: 'Foundation',
      description: 'The library was established with a donation of 500 books from the local historical society.'
    },
    {
      year: '1925',
      title: 'First Building',
      description: 'Our first dedicated building was constructed in the city center, designed by renowned architect Thomas Miller.'
    },
    {
      year: '1968',
      title: 'Major Expansion',
      description: 'A significant expansion added the west wing, doubling our capacity and adding dedicated childrens and research sections.'
    },
    {
      year: '1995',
      title: 'Digital Catalog',
      description: 'We implemented our first digital catalog system, revolutionizing how patrons could search and access our collections.'
    },
    {
      year: '2010',
      title: 'Modern Renovation',
      description: 'A complete renovation transformed our spaces into the modern, technology-enabled facility we have today.'
    },
    {
      year: '2023',
      title: 'Digital Innovation',
      description: 'Launch of our comprehensive digital platform, providing unprecedented access to our resources from anywhere.'
    }
  ];

  // Statistics
  const stats = [
    { label: 'Books in Collection', value: '250,000+' },
    { label: 'Digital Resources', value: '50,000+' },
    { label: 'Annual Visitors', value: '120,000' },
    { label: 'Years of Service', value: '130+' }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'white', 
          py: { xs: 6, md: 10 },
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: 'linear-gradient(rgba(30, 64, 175, 0.85), rgba(30, 64, 175, 0.95)), url(https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Decorative elements */}
        <Box sx={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 70%)',
          top: '-100px',
          right: '10%',
          zIndex: 0
        }} />
        <Box sx={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 70%)',
          bottom: '-50px',
          left: '5%',
          zIndex: 0
        }} />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography 
                variant="h2" 
                component="h1" 
                gutterBottom 
                fontWeight="bold"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                }}
              >
                About Our Library
              </Typography>
              <Typography 
                variant="h6" 
                paragraph
                sx={{
                  maxWidth: '600px',
                  mb: 4,
                  opacity: 0.9
                }}
              >
                Serving our community with knowledge, resources, and spaces for learning and connection since 1892.
              </Typography>
            </Grid>
            
            {!isMobile && (
              <Grid item xs={12} md={6}>
                <Box 
                  sx={{ 
                    position: 'relative',
                    height: '350px',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center'
                  }}
                >
                  {/* Stacked images */}
                  <Box 
                    component="img"
                    src="https://images.unsplash.com/photo-1568667256549-094345857637?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                    sx={{
                      position: 'absolute',
                      width: '60%',
                      height: 'auto',
                      borderRadius: 3,
                      boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                      transform: 'rotate(-5deg)',
                      top: '10%',
                      left: '5%',
                      zIndex: 1
                    }}
                  />
                  <Box 
                    component="img"
                    src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                    sx={{
                      position: 'absolute',
                      width: '60%',
                      height: 'auto',
                      borderRadius: 3,
                      boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                      transform: 'rotate(5deg)',
                      top: '25%',
                      right: '5%',
                      zIndex: 2
                    }}
                  />
                </Box>
              </Grid>
            )}
          </Grid>
        </Container>
      </Box>

      {/* Mission & Vision Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <Box>
              <Typography 
                variant="h4" 
                component="h2" 
                gutterBottom 
                fontWeight="bold"
                sx={{
                  position: 'relative',
                  display: 'inline-block',
                  zIndex: 1,
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    height: '30%',
                    width: '100%',
                    background: 'rgba(59, 130, 246, 0.2)',
                    zIndex: -1,
                    borderRadius: 1
                  }
                }}
              >
                Our Mission
              </Typography>
              <Typography variant="body1" paragraph sx={{ mt: 3 }}>
                Our mission is to inspire lifelong learning, advance knowledge, and strengthen our community by providing free and equitable access to information, ideas, and technology.
              </Typography>
              <Typography variant="body1" paragraph>
                We strive to be a welcoming space where people of all backgrounds can connect, explore, and grow. Through our collections, programs, and services, we aim to:
              </Typography>
              
              <List>
                {[
                  'Promote literacy and a love of reading',
                  'Support educational achievement and personal growth',
                  'Preserve and share our community history and culture',
                  'Foster innovation and creative expression',
                  'Facilitate access to information and technology'
                ].map((item, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemIcon>
                      <CheckCircleIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box>
              <Typography 
                variant="h4" 
                component="h2" 
                gutterBottom 
                fontWeight="bold"
                sx={{
                  position: 'relative',
                  display: 'inline-block',
                  zIndex: 1,
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    height: '30%',
                    width: '100%',
                    background: 'rgba(147, 51, 234, 0.2)',
                    zIndex: -1,
                    borderRadius: 1
                  }
                }}
              >
                Our Vision
              </Typography>
              <Typography variant="body1" paragraph sx={{ mt: 3 }}>
                We envision a community where everyone has the resources they need to thrive in an increasingly complex world. Our library will be:
              </Typography>
              
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 3, 
                      height: '100%',
                      borderRadius: 3,
                      bgcolor: 'primary.light',
                      color: 'white',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center'
                    }}
                  >
                    <MenuBookIcon sx={{ fontSize: 40, mb: 2 }} />
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      A Center for Learning
                    </Typography>
                    <Typography variant="body2">
                      Providing resources and programs that support education at all stages of life
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 3, 
                      height: '100%',
                      borderRadius: 3,
                      bgcolor: 'secondary.light',
                      color: 'white',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center'
                    }}
                  >
                    <PeopleIcon sx={{ fontSize: 40, mb: 2 }} />
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      A Community Hub
                    </Typography>
                    <Typography variant="body2">
                      Creating spaces where people connect, collaborate, and build relationships
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 3, 
                      height: '100%',
                      borderRadius: 3,
                      bgcolor: 'info.light',
                      color: 'white',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center'
                    }}
                  >
                    <SchoolIcon sx={{ fontSize: 40, mb: 2 }} />
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      An Innovation Lab
                    </Typography>
                    <Typography variant="body2">
                      Offering access to emerging technologies and fostering digital literacy
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 3, 
                      height: '100%',
                      borderRadius: 3,
                      bgcolor: 'success.light',
                      color: 'white',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center'
                    }}
                  >
                    <EmojiEventsIcon sx={{ fontSize: 40, mb: 2 }} />
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      A Cultural Beacon
                    </Typography>
                    <Typography variant="body2">
                      Celebrating diverse perspectives and preserving our shared heritage
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Container>
      
      {/* Statistics Section */}
      <Box 
        sx={{ 
          py: 8, 
          bgcolor: 'grey.50',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Typography 
            variant="h4" 
            component="h2" 
            align="center" 
            gutterBottom 
            fontWeight="bold"
            sx={{ mb: 6 }}
          >
            Our Library by the Numbers
          </Typography>
          
          <Grid container spacing={4} justifyContent="center">
            {stats.map((stat, index) => (
              <Grid item key={index} xs={6} md={3}>
                <Paper 
                  elevation={2}
                  sx={{ 
                    p: 3, 
                    textAlign: 'center',
                    height: '100%',
                    borderRadius: 3,
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 3
                    }
                  }}
                >
                  <Typography 
                    variant="h3" 
                    component="div" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 'bold',
                      background: 'linear-gradient(45deg, #1e40af, #3b82f6)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      
      {/* History Timeline Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography 
          variant="h4" 
          component="h2" 
          align="center" 
          gutterBottom 
          fontWeight="bold"
          sx={{ mb: 6 }}
        >
          Our History
        </Typography>
        
        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
          <Timeline position={isMobile ? "right" : "alternate"}>
            {historyTimeline.map((item, index) => (
              <TimelineItem key={index}>
                <TimelineOppositeContent 
                  sx={{ 
                    m: 'auto 0',
                    display: { xs: 'none', md: 'block' }
                  }}
                >
                  <Typography 
                    variant="h6" 
                    component="span" 
                    fontWeight="bold"
                    color="primary.main"
                  >
                    {item.year}
                  </Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot 
                    color={index % 2 === 0 ? "primary" : "secondary"}
                    variant="outlined"
                    sx={{ 
                      p: 1,
                      borderWidth: 3
                    }}
                  />
                  {index < historyTimeline.length - 1 && (
                    <TimelineConnector sx={{ height: 60 }} />
                  )}
                </TimelineSeparator>
                <TimelineContent sx={{ py: '12px', px: 2 }}>
                  <Typography 
                    variant="h6" 
                    component="span" 
                    fontWeight="bold"
                    sx={{ 
                      display: { xs: 'block', md: 'none' },
                      color: 'primary.main',
                      mb: 1
                    }}
                  >
                    {item.year}
                  </Typography>
                  <Paper 
                    elevation={1}
                    sx={{ 
                      p: 2, 
                      bgcolor: index % 2 === 0 ? 'primary.light' : 'secondary.light',
                      color: 'white',
                      borderRadius: 2
                    }}
                  >
                    <Typography variant="h6" component="div" fontWeight="bold">
                      {item.title}
                    </Typography>
                    <Typography>{item.description}</Typography>
                  </Paper>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </Box>
      </Container>
      
      {/* Team Section */}
      <Box 
        sx={{ 
          py: 8, 
          bgcolor: 'grey.50',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Typography 
            variant="h4" 
            component="h2" 
            align="center" 
            gutterBottom 
            fontWeight="bold"
            sx={{ mb: 2 }}
          >
            Meet Our Team
          </Typography>
          <Typography 
            variant="subtitle1" 
            align="center" 
            color="text.secondary" 
            paragraph
            sx={{ 
              maxWidth: 700, 
              mx: 'auto',
              mb: 6
            }}
          >
            Our dedicated staff works tirelessly to provide exceptional service and create a welcoming environment for all library patrons.
          </Typography>
          
          <Grid container spacing={4}>
            {teamMembers.map((member) => (
              <Grid item key={member.id} xs={12} sm={6} md={3}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 3,
                      '& .member-image': {
                        transform: 'scale(1.05)'
                      }
                    }
                  }}
                >
                  <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                    <CardMedia
                      className="member-image"
                      component="img"
                      height="240"
                      image={member.image}
                      alt={member.name}
                      sx={{ 
                        transition: 'transform 0.5s ease'
                      }}
                    />
                  </Box>
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                    <Typography variant="h6" component="div" fontWeight="bold">
                      {member.name}
                    </Typography>
                    <Typography 
                      variant="subtitle2" 
                      color="primary" 
                      gutterBottom
                      sx={{ mb: 2 }}
                    >
                      {member.role}
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="body2" color="text.secondary">
                      {member.bio}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      
      {/* Call to Action */}
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: 4,
            background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
            color: 'white',
            textAlign: 'center'
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom fontWeight="bold">
            Join Our Community
          </Typography>
          <Typography variant="h6" paragraph sx={{ maxWidth: 700, mx: 'auto', mb: 4 }}>
            Become a member today and gain access to our full range of resources, services, and programs.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              size="large"
              component={Link}
              to="/register"
              sx={{ 
                bgcolor: 'white', 
                color: 'primary.dark',
                px: 4,
                py: 1.5,
                fontWeight: 'bold',
                borderRadius: 2,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.9)'
                }
              }}
            >
              Become a Member
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              component={Link}
              to="/contact"
              endIcon={<ArrowForwardIcon />}
              sx={{ 
                borderColor: 'white',
                color: 'white',
                px: 4,
                py: 1.5,
                fontWeight: 'bold',
                borderRadius: 2,
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Contact Us
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default About;