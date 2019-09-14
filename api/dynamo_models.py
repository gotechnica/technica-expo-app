from pynamodb.models import Model
from pynamodb.attributes import UnicodeAttribute, JSONAttribute

class Project(Model):
    class Meta:
        table_name = 'Projects'

    project_id = UnicodeAttribute(hash_key=True)
    table_number = UnicodeAttribute(null=True)
    project_name = UnicodeAttribute()
    project_url = UnicodeAttribute()
    challenges = JSONAttribute()
    challenges_won = JSONAttribute() # actually a list

class Company(Model):
    class Meta:
        table_name = 'Companies'

    company_id: UnicodeAttribute(hash_key=True)
    company_name: UnicodeAttribute()
    access_code: UnicodeAttribute()
    challenges: JSONAttribute()
