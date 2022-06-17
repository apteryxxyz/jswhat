# General usage
echo "Simply match an email only"
what fake@mail.com

# Search within a string
echo "Find every possible match within"
what fake@mail.com e@mail.com -s

# Filter the output by a name, short name, category or tag
echo "Only match possible email addresses"
what fake@mail.com e@mail.com -s --filter="Email"

# Exclude a name, short name, category or tag
echo "Exclude a property from the results, in this case URLs and YouTube related"
what fake@mail.com https://youtube.com/pewdiepie -s --exclude="URL,YouTube"