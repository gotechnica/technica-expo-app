from bs4 import BeautifulSoup
import urllib.request as ur
from functools import reduce 

def get_challenges(link):
    sock = ur.urlopen(link)
    soup = BeautifulSoup(sock,"html.parser")

    #Find the prizes
    filters = soup.find("form",{"class":"filter-submissions"}).findAll("ul")
    prize_list = filters[0].findAll("label")
    prize_ids = [prize.find("input")["value"] for prize in prize_list]
    prize_list = [row.contents[-1] for row in prize_list]

    if(link[-1]!="/"):
        link+="/"

    num_winners = []

    #Find the number of winners for each prize
    for id_ in prize_ids:
        winners = 0
        new_link = link+"search?&prize_filter%5Bprizes%5D%5B%5D="+str(id_)

        id_soup = BeautifulSoup(ur.urlopen(new_link),"html.parser")

        #Find the number of pages of projects
        num_pages = id_soup.find("ul",{"class":"pagination"})
        if(num_pages):
            num_pages = int(num_pages.findAll("li")[-2].text)
        else:
            num_pages = 1

        # Add to gether winners on each page
        for i in range(1,num_pages+1):
            new_link = link+"search?page="+str(i)+"&prize_filter%5Bprizes%5D%5B%5D="+str(id_)

            id_soup = BeautifulSoup(ur.urlopen(new_link),"html.parser")
            winners+=len(id_soup.findAll("img",{"class":"winner"}))

        num_winners.append(winners)

    #Split it up into challenge, company and winners 
    ret_list = []

    for i,row in enumerate(prize_list):
        if(len(row.split(" - ")) == 2):
            ret_list.append(tuple(row.split(" - "))+(num_winners[i],))
    
    return ret_list
